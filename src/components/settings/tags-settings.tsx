"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Tag } from "@/types";

export function TagsSettings() {
	const [tags, setTags] = useState<Tag[]>([]);
	const [newTagName, setNewTagName] = useState("");
	const [newTagColor, setNewTagColor] = useState("#3b82f6");
	const [editingTag, setEditingTag] = useState<Tag | null>(null);

	useEffect(() => {
		fetchTags();
	}, []);

	const fetchTags = async () => {
		const response = await fetch("/api/tags");
		const data = await response.json();
		setTags(data.tags || []);
	};

	const addTag = async () => {
		if (!newTagName.trim()) return;

		const response = await fetch("/api/tags", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: newTagName,
				color: newTagColor
			})
		});

		const data = await response.json();
		setTags([...tags, data.tag]);
		setNewTagName("");
		setNewTagColor("#3b82f6");
		toast.success("Tag criada com sucesso!");
	};

	const updateTag = async () => {
		if (!editingTag) return;

		await fetch("/api/tags", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ tag: editingTag })
		});

		setTags(tags.map(t => t.id === editingTag.id ? editingTag : t));
		setEditingTag(null);
		toast.success("Tag atualizada com sucesso!");
	};

	const deleteTag = async (id: string, name: string) => {
		await fetch("/api/tags", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id })
		});

		setTags(tags.filter(t => t.id !== id));
		toast.success(`Tag "${name}" removida com sucesso!`);
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-semibold mb-4">Gerenciar Tags</h2>
				<p className="text-muted-foreground mb-6">
					Crie e gerencie tags para organizar suas tarefas, hábitos e atividades diárias.
				</p>
			</div>

			{/* Adicionar nova tag */}
			<div className="flex gap-4 items-end">
				<div className="flex-1">
					<Label htmlFor="tagName">Nome da Tag</Label>
					<Input
						id="tagName"
						value={newTagName}
						onChange={(e) => setNewTagName(e.target.value)}
						placeholder="Digite o nome da tag..."
						onKeyDown={(e) => e.key === "Enter" && addTag()}
					/>
				</div>
				<div>
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

			{/* Lista de tags */}
			<div className="space-y-4">
				<h3 className="text-lg font-medium">Tags Existentes</h3>
				<div className="grid gap-2">
					{tags.map((tag) => (
						<div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg">
							{editingTag?.id === tag.id ? (
								<div className="flex gap-2 items-center flex-1">
									<Input
										value={editingTag.name}
										onChange={(e) => setEditingTag({...editingTag, name: e.target.value})}
										className="flex-1"
									/>
									<Input
										type="color"
										value={editingTag.color}
										onChange={(e) => setEditingTag({...editingTag, color: e.target.value})}
										className="w-16"
									/>
									<Button onClick={updateTag} size="sm">Salvar</Button>
									<Button onClick={() => setEditingTag(null)} variant="outline" size="sm">
										Cancelar
									</Button>
								</div>
							) : (
								<>
									<div className="flex items-center gap-3">
										<Badge style={{ backgroundColor: tag.color, color: 'white' }}>
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
											onClick={() => deleteTag(tag.id, tag.name)}
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
		</div>
	);
}