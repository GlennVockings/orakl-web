import { CreateGameDialog, LogOutDialog, GamesList, JoinGameDialog } from "@/components";
import { Button } from "@/components/ui/button";

export default function Account() {

  return (
    <div className="my-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-4">
        <div className="flex flex-col gap-4 border rounded-xl p-2">
          <Button variant={"link"}>
            Account
          </Button>
          <Button variant={"link"}>
            Games
          </Button>
          <LogOutDialog />
        </div>
        <div className="col-span-3 flex flex-col gap-4">
          <p className="text-2xl  uppercase">Games</p>
            <GamesList />
          <div className="flex gap-4">
            <CreateGameDialog />
            <JoinGameDialog />
          </div>
        </div>
      </div>
      
    </div>
  );
}
