@extends('certificates.layout')

@section('content')
    <h1 style="text-align: center; margin: 30px 0;">CERTIFICATE OF INDIGENCY</h1>
    
    <p style="margin: 20px 0;">Certificate No: {{ $certificateNo }}</p>
    
    <p style="text-align: justify; line-height: 1.6;">
        This is to certify that <strong>{{ $residentName }}</strong>, of legal age, residing at 
        <strong>{{ $residentAddress }}</strong>, is a bonafide resident of this Barangay and belongs 
        to the indigent families in our community.
    </p>
    
    <p style="text-align: justify; line-height: 1.6;">
        This certification is being issued upon the request of the above-named person for 
        <strong>{{ $purpose }}</strong> purposes.
    </p>
    
    <p style="margin: 30px 0;">
        Issued this {{ $date }} at the Barangay Hall, [Barangay Name], [City Name].
    </p>
@endsection