import React from "react";

export default function Skeleton() {
    return (
        <>
            <div class="w-full flex flex-col gap-5">
                <div class="h-3 bg-gray-200  w-full"></div>
                <div class="h-3 bg-gray-200  w-full"></div>
                <div class="h-3 bg-gray-200  w-full"></div>
                <div class="h-3 bg-gray-200  w-full"></div>
                <div class="h-3 bg-gray-200  w-full"></div>
            </div>
        </>
    );
}
