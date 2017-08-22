<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        switch($this->method()) {
            case 'POST':
            {
                return [
                    'code'      => 'required|unique:products',
                    'name'      => 'required',
                    'price'     => 'required|numeric|min:1000',
                    'quantity'  => 'required|numeric|min:0',
                    'discount'  => 'numeric|max:100',
                    'discount_event'  => 'numeric|max:100'
                ];
            }
            case 'PATCH':
            {
                return [
                    'code'      => ['required', Rule::unique('products')->ignore($this->route('id'))],
                    'name'      => 'required',
                    'price'     => 'required|numeric|min:1000',
                    'quantity'  => 'required|numeric|min:0',
                    'discount'  => 'numeric|max:100',
                    'discount_event'  => 'numeric|max:100'
                ];
            }
            default: return [];

        }
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'required'  => 'Vui lòng nhập trường :attribute',
            'numeric'   => 'Trường :attribute phải là số',
            'min'       => 'Giá trị tối thiểu của trường :attribute là :min',
            'max'       => 'Giá trị tối thiểu của trường :attribute là :max',
            'unique'    => 'Trường :attribute đã tồn tại'
        ];
    }
}
