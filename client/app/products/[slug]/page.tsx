import { getProductBySlug, getInventoryByProduct } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const inventory = await getInventoryByProduct(product._id);
  const totalStock = inventory.reduce((sum, record) => sum + record.quantity, 0);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
          {product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-muted-foreground">No image available</span>
          )}
        </div>

        {/* Details */}
        <div>
          <Badge variant="secondary" className="mb-2">
            {product.brand.name}
          </Badge>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            SKU: {product.sku} &nbsp;|&nbsp; {product.category.name}
          </p>

          <p className="text-3xl font-bold text-primary mt-4">
            AED {product.sellingPrice}
            <span className="text-sm text-muted-foreground font-normal ml-2">
              / {product.unit}
            </span>
          </p>

          <p className="mt-2 text-sm">
            {totalStock > 0 ? (
              <span className="text-green-500">
                In Stock ({totalStock} available)
              </span>
            ) : (
              <span className="text-destructive">Out of Stock</span>
            )}
          </p>

          <div className="mt-6">
            <AddToCartButton
              productId={product._id}
              disabled={totalStock === 0}
            />
          </div>

          <Separator className="my-6" />

          {product.description && (
            <>
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <Separator className="my-6" />
            </>
          )}

          {product.specifications.length > 0 && (
            <>
              <h2 className="font-semibold mb-3">Specifications</h2>
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="py-2 text-muted-foreground">{spec.key}</td>
                      <td className="py-2 text-right">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Separator className="my-6" />
            </>
          )}

          {inventory.length > 0 && (
            <>
              <h2 className="font-semibold mb-3">Availability by Branch</h2>
              <ul className="text-sm space-y-1">
                {inventory.map((record) => (
                  <li key={record._id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {record.branch.name} ({record.branch.code})
                    </span>
                    <span className={record.quantity > 0 ? "text-green-500" : "text-destructive"}>
                      {record.quantity > 0 ? `${record.quantity} available` : "Out of stock"}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </main>
  );
}