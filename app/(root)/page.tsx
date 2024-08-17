import AddDocumentBtn from "@/components/AddDocumentBtn";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { getAllDocuments } from "@/lib/actions/room.actions";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";

export default async function Home() {
  
  const clerkUser = await currentUser();
  if(!clerkUser) {
    redirect('/sign-in');
  }

  const allDocuments = await getAllDocuments({ email: clerkUser.emailAddresses[0].emailAddress });

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
      <div className="flex items-center gap-2 lg:gap-4">
        Notification
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      </Header>
      {
        allDocuments.data.length > 0 ? (
          <div className="document-list-container">
            <div className="document-list-title">
            <h3 className="text-28-semibold">All documents</h3>
            <AddDocumentBtn userId={clerkUser.id} email={clerkUser.emailAddresses[0].emailAddress}/>
            </div>
            <ul className="document-ul">
              {allDocuments.data.map((document: any) => (
                <Link href={`/documents/${document.id}`} key={document.id}>
                <li key={document.id} className="document-list-item cursor-pointer">
                  <div className="flex-1 flex items-center gap-4">
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image
                      src={"/assets/icons/doc.svg"}
                      alt="Document"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1">{document.metadata.title}</p>
                    <p className="text-sm font-light text-blue-100">Created {dateConverter(document.createdAt)}</p>
                  </div>
                  </div>
                </li>
                </Link>
              ))}
            </ul>
          </div>
        ) : (
          <div className="document-list-empty">
          <Image
            src={"/assets/icons/doc.svg"}
            alt="Document"
            width={40}
            height={40}
            className="mx-auto"
          />
          <AddDocumentBtn userId={clerkUser.id} email={clerkUser.emailAddresses[0].emailAddress}/>
          </div>
      )}
    </main>
  );
}
