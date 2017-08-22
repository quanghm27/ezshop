<?php

namespace App\Http\Controllers;

use App\Customer;
use App\Product;
use App\Http\Requests\OrderRequest;
use App\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('customer')
            ->where('deleted', false)
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function getOrderWithDate($fromDate, $toDate)
    {
        $orders = Order::with('products','customer')
            ->where('deleted', false)
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function create(OrderRequest $request)
    {
        $customer = Customer::find($request->get('customer_id'));
        $order = new Order(['total_price' => $request->get('total_price')]);

        DB::beginTransaction();
        $customer->orders()->save($order);

        foreach ($request->get('products') as $product) {
            $order->products()->attach(
                $product['id'],
                [
                    'price'    => $product['price'],
                    'discount' => $product['discount'],
                    'quantity' => $product['quantity'],
                ]
            );
            $productP = Product::find($product['id']);
            $productP->setAttribute('quantity', ($productP->quantity - $product['quantity']));
            if (!$productP->save()) {
                DB::rollBack();
                return response()->json(['error' => ['Không thêm được đơn hàng']], 500);
            }
        }
        DB::commit();

        return response()->json($order);
    }

    public function delete($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['error' => ['Đơn hàng không tồn tại']], 404);
        }

        $order->setAttribute('deleted', true);
        if ($order->save()) {
            return response()->json([]);
        }

        return response()->json(['error' => ['Không thể xóa đơn hàng']], 500);
    }

    public function find($id)
    {
        $order = Order::with('products', 'customer')
            ->where('id', $id)->where('deleted', false)->first();

        if (!$order) {
            return response()->json(['error' => ['Đơn hàng không tồn tại']], 404);
        }

        $products = [];
        foreach ($order->getRelationValue('products') as $product) {
            array_push(
                $products,
                [
                    'id'             => $product->id,
                    'code'           => $product->code,
                    'name'           => $product->name,
                    'quantity'       => $product->quantity,
                    'quantityOld'    => $product->quantity,
                    'image'          => $product->image,
                    'sell'           => $product->pivot->quantity,
                    'sellOld'        => $product->pivot->quantity,
                    'price'          => $product->pivot->price,
                    'totalDiscount'  => $product->pivot->discount,
                    'discount'       => 0, // Because price is fixed, so discount doesn't matter
                    'discount_event' => 0, // Because price is fixed, so discount doesn't matter,
                    'total'          => $product->pivot->quantity * $product->pivot->price - $product->pivot->discount,
                ]
            );
        }

        $order->setAttribute('products', $products);
        $order->setAttribute('customer', $order->getRelationValue('customer'));

        return response()->json($order->attributesToArray());
    }

    public function update($id, Request $request)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['error' => ['Đơn hàng không tồn tại']], 404);
        }

        $customerId = $request->get('customer_id');
        $customer = Customer::find($customerId);
        if (!$customer) {
            return response()->json(['error' => ['Khách hàng không tồn tại']], 404);
        }

        DB::beginTransaction();

        try {
            $order->customer()->associate($customer);
            $sync = [];
            $totalPrice = 0;
            foreach ($request->get('products') as $p) {
                $sync[$p['id']] = [
                    'price'    => $p['price'],
                    'discount' => $p['discount'],
                    'quantity' => $p['quantity'],
                ];
                $totalPrice = $totalPrice + ($p['price'] * $p['quantity'] - $p['discount']);

                // Re-set product quantity
                $productP = Product::find($p['id']);
                $productP->setAttribute('quantity', ($productP->quantity - $p['changeQuantity']));
                if (!$productP->save()) {
                    DB::rollBack();
                    return response()->json(['error' => ['Không thêm được đơn hàng']], 500);
                }
            }
            $order->products()->sync($sync);
            $order->setAttribute('total_price', $totalPrice);
            $order->save();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => ['Không thể cập nhật đơn hàng']], 500);
        }
        DB::commit();

        return response()->json([]);
    }
}
