import { Check, MoveLeft, MoveRight, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Layout } from '~/components/common/Layout';
import { Button } from '~/components/ui/button';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Spinner } from '~/components/ui/spinner';
import { hasAccess } from '~/utils/authAssertions';

const ExerciseId: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [isComplete, setIsComplete] = useState(false);

    function changeTimerState() {
        setIsComplete(!isComplete);
    }

    const deleteMutation = api.exercise.delete.useMutation();

    const id = router.query.id;
    const query = api.exercise.get.useQuery(id as string);
    const exercise = query.data;

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            await deleteMutation.mutateAsync(id);
            await router.push('/');
        }
    };

    return (
        <Layout className="min-h-[calc(100vh-65px)] w-full items-center bg-hero-pattern">
            <Head>
                <title>{exercise?.title}</title>
            </Head>
            {!exercise && <Spinner size="large" />}
            {exercise && (
                <div className="h-2/3 w-2/3 space-y-6 rounded-2xl bg-neutral-200 p-14 drop-shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="font-semibold">{exercise.title}</h1>
                            {hasAccess(
                                session?.user?.permissions ?? [],
                                'exercise',
                                'delete',
                            ) && (
                                <Trash2
                                    className="text-red-500 transition-colors hover:cursor-pointer hover:text-red-400"
                                    onClick={() => handleDelete(exercise.id)}
                                />
                            )}
                        </div>
                        {!isComplete ? (
                            <CountdownCircleTimer
                                isPlaying
                                duration={1}
                                colors="#262626"
                                size={32}
                                strokeWidth={4}
                                onComplete={changeTimerState}
                            >
                                {({ remainingTime }) => remainingTime}
                            </CountdownCircleTimer>
                        ) : (
                            <Check className="stroke-2 text-green-600" />
                        )}
                    </div>
                    <div className="flex w-full justify-center">
                        <Image
                            src="https://soulful-images.s3.eu-central-1.amazonaws.com/2024-03-21_212527.png"
                            width={1920}
                            height={1080}
                            alt="Exercise title image"
                            className="w-2/3 rounded-lg"
                        />
                    </div>
                    <div
                        className="text-justify"
                        dangerouslySetInnerHTML={{
                            __html: exercise.description,
                        }}
                    />
                    <div className="flex items-center justify-between">
                        <Button disabled className="px-10">
                            <MoveLeft />
                        </Button>
                        <Button className="px-10">
                            <MoveRight />
                        </Button>
                    </div>
                </div>
            )}
        </Layout>
    );
};
export default ExerciseId;
