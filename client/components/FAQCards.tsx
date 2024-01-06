import faqs from "@/data/faqs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function FAQCards() {
  return (
    <section className="flex flex-col w-full">
      {faqs.map(({ question, answer }, index) => (
        <Card className="mb-8" key={`faq${index}`}>
          <CardHeader>
            <CardTitle>{question}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{answer}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
