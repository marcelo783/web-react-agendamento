import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaUserFriends } from "react-icons/fa";

export default function Sales() {
  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="text-lg sm:text-xl">
            Últimos pacientes
          </CardTitle>
          <FaUserFriends className="ml-auto w-4 h-4" />
        </div>
        <CardDescription>Novos pacientes nas Últimas 24 horas</CardDescription>
      </CardHeader>

      <CardContent >
      <ScrollArea className="h-64">
        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/marcelo783.png" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm:text-base font-semibold">Marcelo Oliveira</p>
            <span className="text-[12px] sm:text-gray-400">
              marcelo.oliveira7931@gmail.com
            </span>
          </div>
        </article>

        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/marcelo783.png" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm:text-base font-semibold">Marcelo Oliveira</p>
            <span className="text-[12px] sm:text-gray-400">
              marcelo.oliveira7931@gmail.com
            </span>
          </div>
        </article>

        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/marcelo783.png" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm:text-base font-semibold">Marcelo Oliveira</p>
            <span className="text-[12px] sm:text-gray-400">
              marcelo.oliveira7931@gmail.com
            </span>
          </div>
        </article>

        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/marcelo783.png" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm:text-base font-semibold">Marcelo Oliveira</p>
            <span className="text-[12px] sm:text-gray-400">
              marcelo.oliveira7931@gmail.com
            </span>
          </div>
        </article>

        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/marcelo783.png" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm:text-base font-semibold">Marcelo Oliveira</p>
            <span className="text-[12px] sm:text-gray-400">
              marcelo.oliveira7931@gmail.com
            </span>
          </div>
        </article>

        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/marcelo783.png" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm:text-base font-semibold">Marcelo Oliveira</p>
            <span className="text-[12px] sm:text-gray-400">
              marcelo.oliveira7931@gmail.com
            </span>
          </div>
        </article>

        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/marcelo783.png" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm:text-base font-semibold">Marcelo Oliveira</p>
            <span className="text-[12px] sm:text-gray-400">
              marcelo.oliveira7931@gmail.com
            </span>
          </div>
        </article>

        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/marcelo783.png" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm:text-base font-semibold">Marcelo Oliveira</p>
            <span className="text-[12px] sm:text-gray-400">
              marcelo.oliveira7931@gmail.com
            </span>
          </div>
        </article>

        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/marcelo783.png" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm:text-base font-semibold">Marcelo Oliveira</p>
            <span className="text-[12px] sm:text-gray-400">
              marcelo.oliveira7931@gmail.com
            </span>
          </div>
        </article>
        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/marcelo783.png" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm:text-base font-semibold">Marcelo Oliveira</p>
            <span className="text-[12px] sm:text-gray-400">
              marcelo.oliveira7931@gmail.com
            </span>
          </div>
        </article>

        </ScrollArea>
      </CardContent>
    </Card>
  );
}
