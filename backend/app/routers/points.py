
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.dependencies import get_current_user

router = APIRouter(prefix="/points", tags=["Points"])


class PurchaseRequest(BaseModel):
    code: str


@router.get("/balance")
def get_points_balance(current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["user_id"]
        client = current_user["client"]

        response = (
            client.table("point_transactions")
            .select("amount")
            .eq("user_id", user_id)
            .execute()
        )

        balance = sum(
            transaction["amount"] for transaction in response.data
        )

        return {
            "user_id": user_id,
            "balance": balance
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve points balance: {str(e)}"
        )


@router.post("/purchase")
def purchase_item(
    request: PurchaseRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        client = current_user["client"]

        response = client.rpc(
            "purchase_item",
            {"p_code": request.code}
        ).execute()

        return response.data

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Purchase failed: {str(e)}"
        )


@router.get("/catalog")
def get_item_catalog(
    current_user: dict = Depends(get_current_user)
):
    try:
        client = current_user["client"]

        response = (
            client.table("items")
            .select("item_id, code, name, category, price, is_available")
            .eq("is_available", True)
            .order("category")
            .order("name")
            .execute()
        )

        return {"items": response.data}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve item catalog: {str(e)}"
        )


@router.get("/owned")
def get_owned_items(
    current_user: dict = Depends(get_current_user)
):
    try:
        client = current_user["client"]
        user_id = current_user["user_id"]

        response = (
            client.table("user_items")
            .select("item_id")
            .eq("user_id", user_id)
            .execute()
        )

        item_ids = [
            item["item_id"] for item in response.data
        ]

        if not item_ids:
            return {"owned": []}

        items_response = (
            client.table("items")
            .select("code")
            .in_("item_id", item_ids)
            .execute()
        )

        return {
            "owned": [
                item["code"] for item in items_response.data
            ]
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve owned items: {str(e)}"
        )
