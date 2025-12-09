export default function AboutPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center py-lg px-sm">
      <div className="max-w-4xl bg-white border border-border rounded-lg shadow-lg p-xl">
        <h1 className="text-h1 text-text-primary font-bold mb-lg">About VCSolar</h1>

        <div className="space-y-lg">
          <section>
            <h2 className="text-h2 text-text-primary font-medium mb-md">Our Mission</h2>
            <p className="text-body text-text-primary leading-relaxed">
              VCSolar is dedicated to making renewable energy accessible to everyone. We provide premium solar
              products and solutions for residential and commercial installations, helping our customers achieve energy
              independence.
            </p>
          </section>

          <section>
            <h2 className="text-h2 text-text-primary font-medium mb-md">Why Solar?</h2>
            <p className="text-body text-text-primary leading-relaxed">
              Solar energy is clean, renewable, and increasingly affordable. By investing in solar solutions, you reduce
              your carbon footprint while saving on energy costs. It's an investment in both your future and the planet's
              future.
            </p>
          </section>

          <section>
            <h2 className="text-h2 text-text-primary font-medium mb-md">Our Commitment</h2>
            <ul className="space-y-sm text-body text-text-primary">
              <li>✓ Premium quality products from trusted manufacturers</li>
              <li>✓ Competitive pricing and transparent communication</li>
              <li>✓ Expert support for product selection and installation</li>
              <li>✓ Commitment to sustainability and clean energy</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
