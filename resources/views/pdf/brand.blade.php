@extends('layout.pdf.master')
@section('title')
    Brand List
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
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($brands as $key => $data)
                    <tr>
                        <td>{{ $key + 1 }}</td>
                        <td>{{ $data->name ?? '' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
@endsection
