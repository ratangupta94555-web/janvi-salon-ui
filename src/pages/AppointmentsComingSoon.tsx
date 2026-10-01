import React from "react";
import PublicEditorialHero from "../components/common/PublicEditorialHero";

type Props = { navigate: (to: string) => void };

export default function AppointmentsComingSoon({ navigate }: Props) {
  return (
    <main className="customer-page booking-page">
      <PublicEditorialHero
        className="appointment-hero"
        kicker="APPOINTMENTS"
        title={
          <>
            A little more <em>time.</em>
          </>
        }
        description="We’re putting the finishing touches on online booking. For now, get in touch and we’ll help you plan your visit."
        image="/images/janvi-bridal-finish.jpeg"
        imageAlt="A finished bridal look by Janvi"
        secondaryImage="/images/janvi-makeup-portrait.jpeg"
        secondaryImageAlt="A makeup look by Janvi"
        secondaryCaption="Made for your moment"
        caption="Online booking is coming soon"
        index="04"
        imageLabel="COMING SOON"
        note={
          <>
            Online booking <i>·</i> coming soon
          </>
        }
        actionLabel="Contact the studio"
        onAction={() => navigate("/contact")}
      />
    </main>
  );
}
