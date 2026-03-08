import React, { useEffect } from "react";
import Swal from "sweetalert2";

export default function SwalAlert({ type, title = "Your work has been saved", text, showCancelButton, confirmButtonText, ...rest }) {
    const options = {
        icon: type,
        title: title,
        ...rest,
    };

    if (text) options.text = text;

    if (showCancelButton) {
        options.showCancelButton = true;
        options.showConfirmButton = true;
        if (confirmButtonText) options.confirmButtonText = confirmButtonText;
    } else {
        options.showConfirmButton = false;
        options.timer = 1500;
    }

    return Swal.fire(options);
}
