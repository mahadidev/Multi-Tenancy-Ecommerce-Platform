@extends('layout.pdf.master')
@section('title')
    Brand List
@endsection
@section('custom_css')
    <style>
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .table th,
        .table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }

        .table thead {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        .table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .table tr:hover {
            background-color: #f5f5f5;
        }

        .report-header {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }

        .report-metadata {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 15px;
            text-align: left;
        }
    </style>
@endsection
@section('content')
    <div class="report-metadata">
        <p>Total brands: {{ $brands->count() }}</p>
    </div>

    @if ($brands)
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($brands as $key => $data)
                    <tr>
                        <td>{{ $key + 1 }}</td>
                        <td>
                            <img src="{{ public_path('storage/' . $data->image) }}" alt="{{ $data->name }}" width="50">
                        </td>
                        <td>{{ $data->name ?? '' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
@endsection
