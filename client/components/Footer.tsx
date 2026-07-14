export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-primary mb-2">AL AJER</h3>
          <p className="text-sm text-muted-foreground">
            Building Material Trading LLC — hardware, power tools, and
            building materials across 3 stores in the UAE.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Contact</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>055 883 0854</li>
            <li>alajerbmt@hotmail.com</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>About Us</li>
            <li>Our Stores</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AL AJER Building Material Trading LLC. All rights reserved.
      </div>
    </footer>
  );
}