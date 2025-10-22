// Solution 5: Complete implementation with your current code structure
import type React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoPencil } from "react-icons/go";
import { BsFillPeopleFill } from "react-icons/bs";

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
import { useConsumerContext } from "../contexts/ConsumerContext";
import { ConsumingStreamInformation } from "@/services/ConsumerManager";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function HostControlSidebar({
  children,
  onInviteClick,
  isHost,
  hostName,
}: {
  children: React.ReactNode;
  onInviteClick: () => void;
  isHost: boolean;
  hostName?: string;
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

  const {
    consumersInformation,
    updateNotification,
  }: {
    consumersInformation: Map<string, ConsumingStreamInformation>;
    updateNotification: number;
  } = useConsumerContext();

  useEffect(() => {
    console.log(
      "Consumers Information Updated inside <HostControlSidebar>:",
      consumersInformation
    );
  }, [updateNotification]);

  const [noiseSuppression, setNoiseSuppression] = useState<boolean>(false);

  return (
    console.log(
      "Rendering HostControlSidebar with consumersInformation:",
      consumersInformation
    ),
    (
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
                {Utils.capitalize(hostName ?? "")}'s studio
              </h1>
            </div>
            <div className="flex gap-2 items-center">
              {isHost && (
                <Button
                  className="h-9 bg-card hover:bg-light-card"
                  onClick={onInviteClick}
                >
                  <TiUserAdd className="!w-5 !h-7" />
                  <span className="spl-5">Invite</span>
                </Button>
              )}
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
                    <span className="text-[10px] text-muted-foreground font-bold">
                      RECORDING OVERVIEW
                    </span>
                    <div className="flex flex-row h-[25px] justify-between items-center mt-2">
                      <div className="flex w-[60%] items-center">
                        <Input
                          type="text"
                          placeholder="Search people..."
                          className="bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none m-0 p-0 text-sm hover:bg-transparent focus:bg-transparent"
                        />
                        <GoPencil color="var(--muted-foreground)" />
                      </div>
                      <div className="bg-dark-card rounded-sm px-2 py-1 ">
                        <p className="text-[11px]">00:00</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-[500]">
                      Audio & Video - 1080p (720 ive)
                    </span>

                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BsFillPeopleFill color="var(--muted-foreground)" />
                        <span className="text-[10px] text-muted-foreground font-[500]">
                          Just you
                        </span>
                      </div>
                      <div className="flex gap-2 items-center ">
                        {isHost && (
                          <Button
                            className="h-6 bg-card hover:bg-light-card"
                            onClick={onInviteClick}
                          >
                            <TiUserAdd className="!w-3 !h-3" />
                            <span className="text-[10px] font-[500]">
                              Invite
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <hr className="my-5 border-t border-[var(--card)]" />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] font-[500]">
                        Remove background noise
                      </span>
                      <Switch
                        size="xs"
                        variant="white"
                        checked={noiseSuppression}
                        onCheckedChange={setNoiseSuppression}
                        aria-label="Toggle background noise removal"
                      />
                    </div>
                  </div>
                  {consumersInformation.values.length > 0 && (
                    <div className="bg-light-card rounded-lg py-2 px-4">
                      {Array.from(consumersInformation.values()).map(
                        (mediaSources: ConsumingStreamInformation, index) =>
                          Array.from(mediaSources.mediaSources.values()).map(
                            (source, sourceIndex) => {
                              const streamId = `consumer-${index}-${sourceIndex}`;
                              return (
                                <div className="mt-2 flex justify-between items-center">
                                  <p className="font-[500] text-[12px]">
                                    {source?.videoParams?.producerName ||
                                      source?.audioParams?.producerName}
                                  </p>
                                </div>
                              );
                            }
                          )
                      )}
                    </div>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="bg-card mr-2 mb-3 rounded-bl-lg rounded-br-lg">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild></DropdownMenuTrigger>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    )
  );
}
