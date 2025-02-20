import AuthForm from "@/components-auth-form/auth-form";

export default function Home({ searchParams }) {
  const formMode = searchParams.mode || "login";
  console.log("Current mode:", formMode);

  // toto je potreba neskor dat aby se zobrazovalo po kliknuti na tlacitko
  return <AuthForm mode={formMode} />;
}
