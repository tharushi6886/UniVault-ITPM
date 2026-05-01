# Marketplace Module - Testing Documentation

This document summarizes the testing strategy and results for the Marketplace Purchase Flow.

## 1. Automated Tests

We have implemented automated logic verification for both the backend and frontend.

### Backend API Tests
- **Path**: `backend/tests/order.test.js`
- **Scope**: Verifies `POST /api/orders` endpoint stability, data validation, and response structure.
- **How to Run**:
  ```bash
  cd backend
  npm test
  ```

### Frontend Component Tests
- **Path**: `frontend/src/features/marketplace/__tests__/PurchaseDone.test.jsx`
- **Scope**: Verifies that the receipt UI correctly renders dynamic data and fee calculations.
- **How to Run**:
  ```bash
  cd frontend
  npm test
  ```

---

## 2. Functional Test Cases (Manual)

The following test cases cover the end-to-end user journey for a buyer.

| Case ID | Feature | Test Step | Expected Result | Status |
| :-- | :-- | :-- | :-- | :-- |
| **TC-01** | **Item Details** | Click "Buy Now" on an item. | Redirected to Delivery Information page. | ✅ Passed |
| **TC-02** | **Validation** | Submit delivery info with empty fields. | Error message shown (e.g., "All fields are required"). | ✅ Passed |
| **TC-03** | **Order Creation** | Fill info and upload a valid PNG receipt. | Order saved to DB; redirected to PurchaseDone. | ✅ Passed |
| **TC-04** | **Receipt Display** | View data on the Success page. | Order ID, Date, and calculations are accurate. | ✅ Passed |
| **TC-05** | **Download** | Click "Download Official Receipt". | A high-quality PNG is saved to the local device. | ✅ Passed |
| **TC-06** | **Security** | Access order API without auth token. | Returns `401 Unauthorized`. | ✅ Passed |

---

## 3. Boundary & Error Testing

- **Large Image Upload**: The system handles large receipt images using a 10MB limit in the Express middleware.
- **Null Data Handling**: The `PurchaseDone` page handles missing order data by redirecting safely back to the marketplace.
- **Invalid Calculations**: Platform fees are calculated at a fixed 3% to prevent rounding errors or manual manipulation during display.

---

> [!TIP]
> For your ITPM report, you can take a screenshot of the `npm test` output in your terminal as "Evidence of Automated Testing".
