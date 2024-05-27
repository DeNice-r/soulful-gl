import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Cog } from 'lucide-react';

const ProfilePopup: React.FC = () => {
    const { data: session } = useSession();

    const image = session?.user?.image ?? '/images/placeholder.svg';
    const name = session?.user?.name ?? 'Користувач';

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className="h-8 w-8 rounded-full"
                    size="icon"
                    variant="ghost"
                >
                    <Image
                        alt={`@${name}'s profile`}
                        className="rounded-full"
                        height={32}
                        src={`${image}`}
                        style={{
                            aspectRatio: '32/32',
                            objectFit: 'cover',
                        }}
                        width={32}
                    />
                    <span className="sr-only">
                        Перемикнути користувацьке меню
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="mt-1 flex min-w-56">
                <div>
                    <div className="flex items-center gap-2 p-3">
                        <Image
                            alt={`@${name}'s profile`}
                            className="rounded-full"
                            height={40}
                            src={`${image}`}
                            style={{
                                aspectRatio: '40/40',
                                objectFit: 'cover',
                            }}
                            quality={100}
                            width={40}
                        />
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="font-medium">{name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {session?.user.email}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-1 p-3">
                        <Link
                            className="flex items-center gap-2 hover:text-slate-600"
                            href="#"
                        >
                            <User className="w-4" />
                            Профіль
                        </Link>
                        <Link
                            className="flex items-center gap-2 hover:text-slate-600"
                            href="/management"
                        >
                            {
                                //add permissions
                            }
                            <Cog className="h-4 w-4" />
                            Керування
                        </Link>
                    </div>
                    <div className="p-3">
                        <Button
                            onClick={() => signOut()}
                            size="sm"
                            variant="destructive"
                            className="transition-colors"
                        >
                            Вихід
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ProfilePopup;
