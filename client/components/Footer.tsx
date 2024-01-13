import dayjs from "dayjs";

export default function Footer() {
  const currentYear = dayjs().year();

  return (
    <footer className="flex flex-row justify-center md:px-8 px-4 py-8">
      <p>&copy; {currentYear} - Brady Vossler 🤠</p>
    </footer>
  );
}
