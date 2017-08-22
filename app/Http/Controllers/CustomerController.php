<?php

namespace App\Http\Controllers;

use App\Customer;
use App\Order;
use App\Http\Requests\CustomerRequest;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::where('deleted', false)
                             ->get();

        return response()->json($customers);
    }

    public function create(CustomerRequest $request)
    {
        $customer = new Customer($request->all());
        if ($customer->save()) {
            return response()->json($customer);
        }

        return response()->json(['error' => ['Không thể thêm khách hàng']], 500);
    }

    public function update($id, CustomerRequest $request)
    {
        $customer = Customer::find($id);
        if ( ! $customer) {
            return response()->json(['error' => ['Khách hàng không tồn tại']], 404);
        }
        $customer->fill($request->all());
        if ($customer->save()) {
            return response()->json($customer);
        }

        return response()->json(['error' => ['Không thể sửa khách hàng']], 500);
    }

    public function delete($id)
    {
        $customer = Customer::find($id);
        if ( ! $customer) {
            return response()->json(['error' => ['Khách hàng không tồn tại']], 404);
        }

        $customer->setAttribute('deleted', true);
        if ($customer->save()) {
            return response()->json([]);
        }

        return response()->json(['error' => ['Không thể xóa khách hàng']], 500);
    }

    public function search(Request $request)
    {
        $keyword = $request->query('keyword');
        if ( ! $keyword || strlen($keyword) < 3) {
            return response()->json([]);
        }

        $customers = Customer::where('name', 'LIKE', $keyword)
                             ->orWhere('phone_number', 'LIKE', $keyword)
                             ->get();

        return response()->json($customers);
    }

    public function find($id)
    {
        $customer = Customer::find($id);
        if ( ! $customer) {
            return response()->json(['error' => ['Khách hàng không tồn tại']], 404);
        }

        return response()->json($customer);
    }

    public function findOrder($id)
    {
        $customer = Customer::with('orders')
            ->where('id', $id)->where('deleted', false)->first();

        if (!$customer) {
            return response()->json(['error' => ['Không tồn tại khách hàng này.']], 404);
        }

        $orders = [];
        foreach ($customer->getRelationValue('orders') as $order) {

            $totalProducts = Order::with('products')
            ->where('id', $order->id)->where('deleted', false)->first()->products->count();

            array_push(
                $orders,
                [
                    'id'               => $order->id,
                    'totalPrice'       => $order->total_price,
                    'dateCreated'      => $order->created_at,
                    'totalProduct'     => $totalProducts
                ]
            );
        }

        return response()->json($orders);
    }
}
