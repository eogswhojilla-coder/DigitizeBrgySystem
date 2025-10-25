@extends('certificates.layout')

@section('content')
    <h1 style="text-align: center; margin: 30px 0;">CERTIFICATE OF RESIDENCY</h1>
    
    <p style="margin: 20px 0;">Certificate No: {{ $certificateNo }}</p>
    
    <p style="text-align: justify; line-height: 1.6;">
        This is to certify that <strong>{{ $residentName }}</strong>, of legal age, is a bonafide resident of 
        <strong>{{ $residentAddress }}</strong> for more than six (6) months.
    </p>
    
    <p style="text-align: justify; line-height: 1.6;">
        This certification is being issued upon the request of the above-named person for 
        <strong>{{ $purpose }}</strong> purposes.
    </p>
    
    <p style="margin: 30px 0;">
        Issued this {{ $date }} at the Barangay Hall, [Barangay Name], [City Name].
    </p>
@endsection