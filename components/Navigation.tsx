import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Navigation() {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center w-full pt-4 px-8">
      <h1
        className="font-bold text-amber-500 text-4xl cursor-pointer"
        onClick={() => router.push("/")}
      >
        Menusto
      </h1>
      <div className="flex gap-4">
        <Button
          size="lg"
          className="font-bold uppercase cursor-pointer"
          onClick={() => router.push("/create-restaurant")}
        >
          Ajouter votre restaurant
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="font-bold uppercase cursor-pointer"
          onClick={() => router.push("/connect-account")}
        >
          Connecter votre restaurant
        </Button>
      </div>
    </div>
  );
}
