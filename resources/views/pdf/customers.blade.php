@extends('layout.pdf.master')
@section('title')
    Customer List
@endsection

@section('content')
    <div class="report-metadata">
        <p>Total Customers: {{ $customers->count() }}</p>
    </div>

    @if ($customers)
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($customers as $key => $data)
                    <tr>
                        <td>{{ $key + 1 }}</td>
                        <td>
                            @if ($data->image)
                                <img src="{{ public_path('storage/' . $data->image) }}" alt="{{ $data->name }}" width="50">
                            @endif
                        </td>
                        <td>{{ $data->name ?? '' }}</td>
                        <td>{{ $data->email ?? '' }}</td>
                        <td>{{ $data->address ?? '' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
@endsection
