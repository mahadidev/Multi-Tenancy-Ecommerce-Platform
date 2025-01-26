export interface FileType {
	id: number;
	user_id: number;
	name: string;
	type: 'image' | 'pdf';
	response_type: 'url' | 'path';
	width: number;
	height: number;
	alternate_text: string;
	tags: string[];
	location: string;
	url: string;
	created_at: string;
	updated_at: string;
}
