export const ArticleBody = ({ sections }) => {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-32">
          <h2 className="font-display text-2xl font-bold text-secondary">{section.heading}</h2>
          <div className="mt-4 space-y-4">
            {section.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-secondary/75">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
