import { configureStore } from "@reduxjs/toolkit";
import appSlice from "@/app/redux/app-slice";
import accountSlice from "../redux/account-slice";
import barangayResidentSlice from "../redux/barangay-resident-slice";
import inventoriesSlice from "../redux/inventories-slice";
import positionsSlice from "../redux/position-slice";
import administratorSlice from "../redux/administrator-slice";
import blotterSlice from "../redux/blotter-slice";
import barangayOfficialSlice from "../redux/barangay-official-slice";
import certificateTypeSlice from "../redux/certificate-type-slice";
import announcementSlice from "../redux/announcement-slice"; // ✅ Add this import
import familySlice from "../redux/family-slice";
import pendingAccountsSlice from "../redux/pending-accounts-slice";
import borrowRequestsSlice from "../redux/borrow-requests-slice";

const store = configureStore({
    reducer: {
        app: appSlice,
        accounts: accountSlice,
        barangay_residents: barangayResidentSlice,
        barangay_officials: barangayOfficialSlice,
        inventories: inventoriesSlice,
        positions: positionsSlice,
        administrators: administratorSlice,
        blotters: blotterSlice,
        certificateTypes: certificateTypeSlice,
        announcements: announcementSlice, // ✅ Add this line
        families: familySlice.reducer,
        pendingAccounts: pendingAccountsSlice,
        borrowRequests: borrowRequestsSlice,
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
