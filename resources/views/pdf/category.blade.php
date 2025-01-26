@extends('layout.pdf.master')
@section('title')
    Category List
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
        <p>Total Categories: {{ $categories->count() }}</p>
    </div>

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>No.</th>
                <th>Category ID</th>
                <th>Name</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($categories as $key => $category)
                <tr>
                    <td>{{ $key + 1 }}</td>
                    <td>{{ $category->id }}</td>
                    <td>{{ $category->name }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endsection
