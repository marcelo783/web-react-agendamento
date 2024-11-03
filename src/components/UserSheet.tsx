// src/components/UserSheet.tsx
import { useState } from "react"
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { FaUserCircle } from "react-icons/fa"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function UserSheet() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <FaUserCircle 
                  size={25} 
                  className="text-white cursor-pointer fixed right-4"
                />
            </SheetTrigger>
            <SheetContent side="right" className="p-4"> {/* Reduzi o padding */}
                <SheetHeader>
                    <SheetTitle className="text-lg">Perfil do Usuário</SheetTitle> {/* Menor fonte no título */}
                </SheetHeader>
                
                <Card className="w-full max-w-lg mt-4"> {/* Max width menor */}
                    <CardHeader>
                        <CardTitle className="text-center text-base">Editar Informações</CardTitle> {/* Menor fonte no título do card */}
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-3"> {/* Reduzi o espaçamento vertical */}
                            <div>
                                <Label htmlFor="nome" className="text-sm">Nome</Label> {/* Menor fonte */}
                                <Input id="nome" type="text" name="nome" className="text-sm py-1" required /> {/* Input mais compacto */}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> {/* Menor espaçamento */}
                                <div>
                                    <Label htmlFor="email" className="text-sm">Email</Label>
                                    <Input id="email" type="email" name="email" className="text-sm py-1" required />
                                </div>
                                <div>
                                    <Label htmlFor="senha" className="text-sm">Senha</Label>
                                    <Input id="senha" type="password" name="senha" className="text-sm py-1" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="especialidade" className="text-sm">Especialidade</Label>
                                    <Input id="especialidade" type="text" name="especialidade" className="text-sm py-1" required />
                                </div>
                                <div>
                                    <Label htmlFor="telefone" className="text-sm">Telefone</Label>
                                    <Input id="telefone" type="tel" name="telefone" className="text-sm py-1" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="userName" className="text-sm">Nome de Usuário</Label>
                                    <Input id="userName" type="text" name="userName" className="text-sm py-1" required />
                                </div>
                                <div>
                                    <Label htmlFor="registroProfissional" className="text-sm">CPI</Label>
                                    <Input id="registroProfissional" type="text" name="registroProfissional" className="text-sm py-1" required />
                                </div>
                            </div>
                            <Button className="w-full bg-blue-500 hover:bg-blue-800 text-sm py-2" type="submit">
                                Salvar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                
               
            </SheetContent>
        </Sheet>
    )
}
