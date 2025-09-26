// Solution 5: Complete implementation with your current code structure
import type React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, ArrowLeftIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { logout } from "@/features/authentication/authSlice";
import { IconButton } from "@/components/ui/icon-button";
import Utils from "@/app/utils";
import { TiUserAdd } from "react-icons/ti";

export default function HostControlSidebar({
  children,
  onInviteClick,
}: {
  children: React.ReactNode;
  onInviteClick: () => void;
}) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);
  const avatar = !user
    ? "-"
    : user?.name.split(" ")[0].charAt(0).toUpperCase() +
      (user?.name.split(" ").length > 1
        ? user?.name.split(" ")[1].charAt(0).toUpperCase()
        : "");

  return (
    <SidebarProvider isPrimary={false}>
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="flex justify-between h-12 shrink-0 items-center pt-5 px-5 mb-2">
          <div className="flex items-center gap-2">
            <IconButton
              className="h-9 bg-transparent"
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowLeftIcon />
            </IconButton>
            <h1 className="text-[15px] tracking-[.10em] font-bold text-foreground">
              RIVERSIDE
            </h1>
            <span
              className="w-px h-4 bg-muted-foreground mx-2"
              aria-hidden="true"
            />
            <h1 className="text-[14px] font-[500] text-foreground">
              {Utils.capitalize(user?.name ?? "")}'s studio
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              className="h-9 bg-card hover:bg-light-card"
              onClick={onInviteClick}
            >
              <TiUserAdd className="!w-5 !h-7" />
              <span className="spl-5">Invite</span>
            </Button>
            <SidebarTrigger />
          </div>
        </header>
        <div className="flex flex-1 flex-col px-0">{children}</div>
      </div>

      {/* Right-aligned sidebar with white background */}
      <Sidebar
        side="right"
        isPrimary={true}
        style={
          {
            "--sidebar-background": "white",
            "--sidebar-foreground": "#000000",
            "--sidebar-accent": "#f3f4f6",
            "--sidebar-accent-foreground": "#374151",
            "--sidebar-border": "#e5e7eb",
          } as React.CSSProperties
        }
      >
        <SidebarHeader className="bg-card mt-3 mr-2 rounded-tl-lg rounded-tr-lg">
          <div className="flex items-center gap-2 px-2 py-2">
            <Link to="/" className="flex items-center">
              <h1 className="text-sm font-[500] text-foreground">People</h1>
            </Link>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-card mr-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <div className="bg-light-card rounded-lg py-2 px-4">
                  <span className="text-[11px] text-muted-foreground">
                    Quick settings
                  </span>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="font-[500] text-[12px]">Dusty Porter</p>
                    <div className="bg-dark-card rounded-sm px-2 py-1 ">
                      <p className="text-[11px]">00:00</p>
                    </div>
                  </div>
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="bg-card mr-2 mb-3 rounded-bl-lg rounded-br-lg">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900 hover:bg-gray-50"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/avatars/01.png" alt="@user" />
                      <AvatarFallback className="rounded-lg">
                        {avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name ?? "-"}
                      </span>
                      <span className="truncate text-xs">
                        {user?.email ?? "-"}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side="left"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src="/avatars/01.png" alt="@user" />
                        <AvatarFallback className="rounded-lg">
                          {avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name ?? ""}
                        </span>
                        <span className="truncate text-xs">
                          {user?.email ?? "john@example.com"}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      dispatch(logout());
                      navigate("/login", { replace: true });
                    }}
                  >
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
