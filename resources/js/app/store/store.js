import { configureStore } from "@reduxjs/toolkit";
import appSlice from "@/app/redux/app-slice";
import  accountSlice from "../redux/account-slice";
import  barangayResidentSlice  from "../redux/barangay-resident-slice";
import inventoriesSlice from "../redux/inventories-slice";
import  positionsSlice  from "../redux/position-slice";
import  administratorSlice  from "../redux/administrator-slice";
import  blotterSlice  from "../redux/blotter-slice";
import  barangayOfficialSlice  from "../redux/barangay-official-slice";


const store = configureStore({
    reducer: {
        app: appSlice,
        accounts:accountSlice,
        barangay_residents:barangayResidentSlice,
        inventories:inventoriesSlice,
        positions:positionsSlice,
        administrators:administratorSlice,
        blotters:blotterSlice,
        // barangay_residents:barangayOfficialSlice,

     
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
