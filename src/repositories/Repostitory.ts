interface Repostiory<Input, Output> {
  save(entity: Input): Promise<Output>;
  update(entity: Input): Promise<Output>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Output>;
  findAll(): Promise<Output[]>;
}
