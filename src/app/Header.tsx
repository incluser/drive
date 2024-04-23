import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
    return <div className="border-b py-4 bg-gray-50">
        <div className="container items-center mx-auto justify-between flex">
            <div>FileDrive</div>
            <div className="flex gap-2">
                <OrganizationSwitcher />
                <UserButton />
                <SignedOut>
                    <SignInButton>
                        <Button>Sign in</Button>
                    </SignInButton>
                </SignedOut>
            </div>

        </div>

    </div>
}