import React, { useEffect } from "react";
import Swal from "sweetalert2";

export default function SwalAlert({ type,title= "Your work has been saved" }) {
    return Swal.fire({
        icon: type,
        title: title,
        showConfirmButton: false,
        timer: 1500,
    }); // nothing to render on screen
}
