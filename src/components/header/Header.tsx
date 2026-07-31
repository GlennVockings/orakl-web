import { OraklLogo } from "@/components/brand";
import { PageContainer } from "@/components/layout";
import { AccountButton } from "./AccountButton";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-100 border-b bg-background/90 backdrop-blur-xl">
      <PageContainer className="flex h-16 items-center justify-between">
        <OraklLogo />
        <div className="flex items-center gap-2">
          <AccountButton />
        </div>
      </PageContainer>
    </header>
  );
}
