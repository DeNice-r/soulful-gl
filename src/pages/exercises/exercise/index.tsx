import { Check, MoveLeft, MoveRight } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Layout } from '~/components/common/Layout';
import { Button } from '~/components/ui/button';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const Exercise: React.FC = () => {
    const [isComplete, setIsComplete] = useState(false);

    function changeTimerState() {
        setIsComplete(!isComplete);
    }

    return (
        <Layout className="min-h-[calc(100vh-65px)] w-full items-center bg-hero-pattern">
            <div className="h-2/3 w-2/3 space-y-6 rounded-2xl bg-neutral-200 p-14 drop-shadow-lg">
                <div className="flex items-center justify-between">
                    <h1 className="font-semibold">Заголовок вправи</h1>
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
                <p className="ql-editor text-justify">
                    Sed urna risus, dapibus in egestas quis, dictum sit amet
                    est. Morbi varius elementum sem vitae mattis. In id
                    pellentesque ante, sed pulvinar nibh. Quisque viverra, urna
                    sit amet accumsan tincidunt, nulla enim scelerisque enim,
                    imperdiet euismod leo ex et magna. Etiam consequat imperdiet
                    lobortis. Proin iaculis commodo velit, ut rhoncus nulla
                    ornare at. Aliquam gravida ullamcorper imperdiet. Sed
                    placerat porttitor rutrum. Pellentesque id libero sed purus
                    congue dictum.
                </p>
                <div className="flex items-center justify-between">
                    <Button disabled className="px-10">
                        <MoveLeft />
                    </Button>
                    <Button className="px-10">
                        <MoveRight />
                    </Button>
                </div>
            </div>
        </Layout>
    );
};
export default Exercise;
