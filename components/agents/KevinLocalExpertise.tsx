import Link from "next/link";

export function KevinLocalExpertise() {
  return (
    <section className="mt-8 space-y-5 text-base leading-8 text-stone-300">
      <h2 className="font-display text-2xl text-stone-50">
        Central Texas representation
      </h2>
      <p>
        Kevin advises clients across Salado, Belton, Temple, Georgetown, Harker
        Heights, and surrounding Bell and Williamson County communities. His
        work includes residential purchases and sales, military and
        professional relocations, land, farm and ranch property, and investment
        decisions that require a clear view of both immediate terms and
        long-range ownership.
      </p>
      <p>
        The approach is deliberate: define the objective, narrow the market,
        examine the property, and coordinate the right local diligence before a
        client commits. Start with the{" "}
        <Link href="/neighborhoods" className="text-gold hover:underline">
          neighborhood guides
        </Link>{" "}
        for an introduction to the markets Kevin serves.
      </p>
    </section>
  );
}
