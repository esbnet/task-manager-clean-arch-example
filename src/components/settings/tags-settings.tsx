"use client";

import { Edit, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTags } from "@/hooks/use-tags";
import type { Tag } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { Separator } from "../ui/separator";

export function TagsSettings() {
	const { tags, createTag, updateTag: updateTagContext, deleteTag: deleteTagContext } = useTags();
	const [newTagName, setNewTagName] = useState("");
	const [newTagColor, setNewTagColor] = useState("#3b82f6");
	const [editingTag, setEditingTag] = useState<Tag | null>(null);

	const addTag = async () => {
		if (!newTagName.trim()) return;

		try {
			await createTag({
				name: newTagName,
				color: newTagColor,
			});
			setNewTagName("");
			setNewTagColor("#3b82f6");
			toast.success("Tag criada com sucesso!");
		} catch (error) {
			toast.error("Erro ao criar tag");
		}
	};

	const updateTag = async () => {
		if (!editingTag) return;

		try {
			await updateTagContext(editingTag);
			setEditingTag(null);
			toast.success("Tag atualizada com sucesso!");
		} catch (error) {
			toast.error("Erro ao atualizar tag");
		}
	};

	const deleteTag = async (id: string, name: string) => {
		try {
			await deleteTagContext(id);
			toast.success(`Tag "${name}" removida com sucesso!`);
		} catch (error) {
			toast.error("Erro ao remover tag");
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="mb-2 font-semibold text-2xl">Gerenciar Tags</h2>
				<p className="mb-6 text-muted-foreground">
					Crie e gerencie tags para organizar suas tarefas, hábitos e
					atividades diárias.
				</p>
			</div>

			{/* Adicionar nova tag */}
			<div className="flex items-end gap-4">
				<div className="flex flex-col flex-1 gap-2">
					<Label htmlFor="tagName">Nome da Tag</Label>
					<Input
						id="tagName"
						value={newTagName}
						onChange={(e) => setNewTagName(e.target.value)}
						placeholder="Digite o nome da tag..."
						onKeyDown={(e) => e.key === "Enter" && addTag()}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="tagColor">Cor</Label>
					<Input
						id="tagColor"
						type="color"
						value={newTagColor}
						onChange={(e) => setNewTagColor(e.target.value)}
						className="w-20 h-10"
					/>
				</div>
				<Button onClick={addTag}>
					<Plus size={16} />
					Adicionar
				</Button>
			</div>

			<Separator className="my-6" />

			{/* Lista de tags */}
			<div className="space-y-4">
				<h3 className="font-medium text-lg">Tags Existentes</h3>
				<div className="gap-2 grid">
					{tags.map((tag: Tag) => (
						<div
							key={tag.id}
							className="flex justify-between items-center p-3 border rounded-lg"
						>
							{editingTag?.id === tag.id && editingTag ? (
								<div className="flex flex-1 items-center gap-2">
									<Input
										value={editingTag.name || ""}
										onChange={(e) =>
											setEditingTag({
												...editingTag,
												name: e.target.value,
											})
										}
										className="flex-1"
									/>
									<Input
										type="color"
										value={editingTag.color || "#3b82f6"}
										onChange={(e) =>
											setEditingTag({
												...editingTag,
												color: e.target.value,
											})
										}
										className="w-16"
									/>
									<Button onClick={updateTag} size="sm">
										Salvar
									</Button>
									<Button
										onClick={() => setEditingTag(null)}
										variant="outline"
										size="sm"
									>
										Cancelar
									</Button>
								</div>
							) : (
								<>
									<div className="flex items-center gap-3">
										<Badge
											style={{
												backgroundColor: tag.color,
												color: "white",
											}}
										>
											{tag.name}
										</Badge>
									</div>
									<div className="flex gap-2">
										<Button
											onClick={() => setEditingTag(tag)}
											size="sm"
											variant="ghost"
										>
											<Edit size={14} />
										</Button>
										<Button
											onClick={() =>
												deleteTag(tag.id, tag.name)
											}
											size="sm"
											variant="ghost"
											className="text-destructive"
										>
											<Trash2 size={14} />
										</Button>
									</div>
								</>
							)}
						</div>
					))}
				</div>
			</div>
		</div >
	);
}
