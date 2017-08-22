<?php

namespace App\Http\Controllers;

use App\Product;
use App\Http\Requests\ProductRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::where('deleted', false)
            ->get();

        return response()->json($products);
    }

    public function getProductInEvent()
    {
        $products = Product::where('deleted', false)
            ->where('discount_event', '>', 0)
            ->get();

        return response()->json($products);
    }


    public function create(ProductRequest $request)
    {
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store("public/images");
        }

        $product = new Product($request->all());
        if (isset($path)) {
            $newPath = str_replace('public', 'storage', $path);
            $product->setAttribute('image', $newPath);
        }

        if ($product->save()) {
            return response()->json($product);
        }

        return response()->json(['error' => ['Không thể thêm sản phẩm']], 500);
    }

    public function update($id, ProductRequest $request)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => ['Sản phẩm không tồn tại']], 404);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store("public/images");
        }

        $product->fill($request->all());
        if (isset($path)) {
            $newPath = str_replace('public', 'storage', $path);
            $product->setAttribute('image', $newPath);
        }

        if ($product->save()) {
            return response()->json($product);
        }

        return response()->json(['error' => ['Không thể sửa sản phẩm']], 500);
    }

    public function updateQuantity($id, Request $request)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => ['Sản phẩm không tồn tại']], 404);
        }

        $quantity = $request->get('quantity');
        if (!is_numeric($quantity) || $quantity < 0) {
            return response()->json(['error' => ['Trường quantity không hợp lệ']], 500);
        }

        $product->setAttribute('quantity', $quantity);
        if ($product->save()) {
            return response()->json($product);
        }

        return response()->json(['error' => ['Không thể cập nhật số lượng']], 500);
    }

    public function updateDiscountEvent(Request $request)
    {
        $ids = $request->get('products');
        DB::beginTransaction();
        try {
            foreach ($ids as $id => $discount) {
                Product::where('id', $id)->update(['discount_event' => $discount]);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => ['Không thể cập nhật khuyến mại']], 500);
        }
        DB::commit();
        $products = Product::where('deleted', false)
            ->where('discount_event', '>', 0)
            ->get();
        return response()->json($products);
    }

    public function closeDiscountEvent()
    {
        Product::where('discount_event', '>', 0)->update(['discount_event' => 0]);
    }

    public function closeDiscountProduct($id, Request $request)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => ['Sản phẩm không tồn tại']], 404);
        }

        $product->setAttribute('discount_event', 0);
        if ($product->save()) {
            $products = Product::where('deleted', false)
                ->where('discount_event', '>', 0)
                ->get();
            return response()->json($products);
        }

        return response()->json(['error' => ['Không thể hủy sự kiện giảm giá cho sản phẩm này.']], 500);
    }

    public function delete($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => ['Sản phẩm không tồn tại']], 404);
        }

        $product->setAttribute('deleted', true);
        if ($product->save()) {
            return response()->json([]);
        }

        return response()->json(['error' => ['Không thể xóa sản phẩm']], 500);
    }

    public function findOrder($id)
    {
        $product = Product::with('orders')
            ->where('id', $id)->where('deleted', false)->first();

        if (!$product) {
            return response()->json(['error' => ['Sản phẩm không tồn tại']], 404);
        }

        $orders = [];
        foreach ($product->getRelationValue('orders') as $order) {
            $customer = $order->getRelationValue('customer');
            array_push(
                $orders,
                [
                    'id'               => $order->id,
                    'sell'             => $order->pivot->quantity,
                    'price'            => $order->pivot->price,
                    'totalDiscount'    => $order->pivot->discount,
                    'dateCreated'      => $order->created_at,
                    'customer'         => $customer
                ]
            );
        }

        return response()->json($orders);
    }
}
