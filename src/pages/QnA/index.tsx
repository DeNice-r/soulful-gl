import React, { useState } from 'react';
import { Layout } from '~/components/common/Layout';
import { Button } from '~/components/ui/button';
import {
    Dialog,
    DialogDescription,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { api } from '~/utils/api';

const QnA: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [question, setQuestion] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const QnAs = api.qanda.list.useQuery();

    function changeDialogState() {
        setIsDialogOpen(!isDialogOpen);
    }

    const createMutation = api.qanda.create.useMutation();

    const handleQnACreation = async () => {
        changeDialogState();
        setTimeout(() => {
            void (async () => {
                await createMutation.mutateAsync({
                    authorName: name,
                    authorEmail: email,
                    question: question,
                });
                await QnAs.refetch();
            })();
        });
    };
    return (
        <Layout className="flex w-full flex-col items-center bg-homepage-cover">
            <h3 className="w-full pt-10 text-center font-bold">
                Запитання та відповіді
            </h3>
            <div className="flex w-full flex-col items-center gap-10 py-10 pb-14 md:w-2/3">
                <div className="flex w-full flex-col gap-3 rounded-xl border border-neutral-300 bg-neutral-200/80 p-10 drop-shadow-xl">
                    <h2 className="font-semibold">Запитання:</h2>
                    <span>
                        Чи можу я залишити своє запитання, щоб на нього
                        відповіли пізніше?
                    </span>
                    <h2 className="font-semibold">Відповідь:</h2>
                    <span>
                        Звичайно, ви можете залишити своє запитання, щоб на
                        нього відповіли пізніше! Ми дуже цінуємо наших клієнтів
                        і завжди прагнемо надати найкращий сервіс. Ваше
                        запитання буде збережене, і ми зробимо все можливе, щоб
                        відповісти на нього якнайшвидше. Дбайливе ставлення до
                        кожного клієнта є нашим пріоритетом, тому ви можете бути
                        впевнені, що ваше звернення не залишиться без уваги.
                    </span>
                    <Button
                        className="mt-3 self-center"
                        onClick={changeDialogState}
                    >
                        Запитайте нас
                    </Button>
                </div>
                {QnAs?.data?.map((QnA) => (
                    <div
                        key={QnA.id}
                        className="flex w-full flex-col gap-3 rounded-xl bg-neutral-200 p-10 drop-shadow-xl"
                    >
                        <h2 className="font-semibold">Запитання:</h2>
                        <span>{QnA.question}</span>
                        <h2 className="font-semibold">Відповідь:</h2>
                        <span>{QnA.answer}</span>
                    </div>
                ))}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="flex flex-col items-center">
                    <DialogHeader className="self-start">
                        <DialogTitle>Задати питання</DialogTitle>
                    </DialogHeader>

                    <div className="flex w-4/5 flex-col gap-4 py-4">
                        <div className="flex  items-center justify-end gap-4">
                            <Label htmlFor="name" className="text-right">
                                Ім&apos;я
                            </Label>
                            <Input
                                id="name"
                                placeholder="Антон"
                                className="w-2/3"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex  items-center justify-end gap-4">
                            <Label htmlFor="email" className="text-right">
                                Ел. пошта
                            </Label>
                            <Input
                                id="email"
                                placeholder="anton@gmail.com"
                                className="w-2/3"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            <Label htmlFor="question" className="text-right">
                                Запитання
                            </Label>
                            <Input
                                id="question"
                                placeholder="Чи можливо..."
                                className="w-2/3"
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="self-end">
                        <Button type="submit" onClick={handleQnACreation}>
                            Підтвердити
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
};
export default QnA;
