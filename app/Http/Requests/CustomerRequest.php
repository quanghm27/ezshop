<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
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
                    'name'          => 'required',
                    'phone_number'  => 'required|unique:customers'
                ];
            }
            case 'PATCH':
            {
                return [
                    'name'          => 'required',
                    'phone_number'  => ['required', Rule::unique('customers')->ignore($this->route('id'))]
                ];
            }
            default: break;

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
            'email'   => 'Trường :attribute phải là email',
            'unique'    => 'Trường :attribute đã tồn tại'
        ];
    }
}
