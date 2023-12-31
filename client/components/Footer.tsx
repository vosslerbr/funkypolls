import dayjs from "dayjs";

export default function Footer() {
  const currentYear = dayjs().year();

  return (
    <footer className="flex flex-row justify-center px-24 py-8">
      <p>&copy; {currentYear} - Brady Vossler 🤠</p>
    </footer>
  );
}
