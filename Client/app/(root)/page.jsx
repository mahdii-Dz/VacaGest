import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <header className="flex justify-between pt-16 px-40 items-center">
        <Image src={'/VacaGest.svg'} width={176} height={53} alt="VacaGest Logo" />
        <Link href="/Login">
          <button className="bg-primary hover:bg-primary/80 cursor-pointer w-38.25 h-10 rounded-md text-white font-semibold">Se connecter</button>
        </Link>
      </header>
      <section className="pl-40  mt-16 flex justify-between gap-20 items-center">
        <div>
          <Image src={'/VacaGest2.svg'} width={205} height={48} alt="VacaGest Logo 2" />
          <h1 className="text-5xl font-bold max-w-150.5 mt-8 ">Gestion des enseignants vacataires</h1>
          <p className="text-2xl text-gray-500 max-w-3xl mt-6">Une plateforme dédiée à la gestion, au suivi et à la validation des activités pédagogiques des enseignants vacataires au sein de l'université.</p>
          <Link href="/Login">
            <button className="bg-primary hover:bg-primary/80 mt-8 cursor-pointer text-xl w-44 h-12 rounded-md text-white font-semibold">Commencer</button>
          </Link>
        </div>
        <div>
          <Image src={'/girl-hero.png'} width={535} height={517} alt="hero image" />
        </div>
      </section>
    </main>
  );
}
