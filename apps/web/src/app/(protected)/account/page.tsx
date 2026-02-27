import { LogOutDialog } from "@/components";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";

export default function Account() {

  return (
    <div className="py-10">
      <div className="grid grid-cols-4 gap-4">
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
          <p className="text-xl font-bold tracking-wide underline underline-offset-2">Games</p>
          <div className="grid grid-cols-2 gap-2">
            <Item variant={"outline"}>
              <ItemContent>
                <ItemTitle>Game 1</ItemTitle>
                <ItemDescription>Sports Day</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button>Open</Button>
              </ItemActions>
            </Item>
            <Item variant={"outline"}>
              <ItemContent>
                <ItemTitle>Game 2</ItemTitle>
                <ItemDescription>Sports Day</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button>Open</Button>
              </ItemActions>
            </Item>
          </div>
          <div>
            <Button>
              Create game
            </Button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
