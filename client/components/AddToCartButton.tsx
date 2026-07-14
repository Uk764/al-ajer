"use client";

import { Button } from "@/components/ui/button";

export default function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  return (
    <Button
      size="lg"
      disabled={disabled}
      onClick={() => alert(`Add to cart coming soon! (Product: ${productId})`)}
    >
      {disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}