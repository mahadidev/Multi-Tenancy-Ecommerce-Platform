@extends('layout.pdf.master')
@section('title')
    Product List
@endsection

@section('content')
    <div class="report-metadata">
        <p>Total Products: {{ $products->count() }}</p>
    </div>

    @if ($products)
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Thumbnail</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($products as $key => $data)
                    <tr>
                        <td>{{ $key + 1 }}</td>
                        <td>
                            @if ($data->thumbnail)
                                <img src="{{ public_path('storage/' . $data->thumbnail) }}" alt="{{ $data->name }}" width="50">
                            @endif
                        </td>
                        <td>{{ $data->name ?? '' }}</td>
                        <td>{{ $data->brand->name ?? '' }}</td>
                        <td>{{ number_format($data->price, 2) ?? '' }}</td>
                        <td>{{ $data->stock ?? '' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
@endsection
