@extends('layout.pdf.master')
@section('title')
    Category List
@endsection

@section('content')
    <div class="report-metadata">
        <p>Total Categories: {{ $categories->count() }}</p>
    </div>

    @if ($categories)
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Category ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($categories as $key => $data)
                    <tr>
                        <td>{{ $key + 1 }}</td>
                        <td>{{ $data->id ?? '' }}</td>
                        <td>{{ $data->name ?? '' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
@endsection
