import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';
import { MangoClient } from '../../client';

export class Group {
  static from(publicKey: PublicKey, obj: { admin: PublicKey }): Group {
    return new Group(publicKey, obj.admin);
  }

  constructor(public publicKey: PublicKey, public admin: PublicKey) {}
}

/**
 * @deprecated
 */
export async function createGroup(
  client: MangoClient,
  adminPk: PublicKey,
): Promise<TransactionSignature> {
  const tx = new Transaction();
  const ix = await createGroupIx(client, adminPk);
  tx.add(ix);
  return await client.program.provider.send(tx);
}

/**
 * @deprecated
 */
export async function createGroupIx(
  client: MangoClient,
  adminPk: PublicKey,
): Promise<TransactionInstruction> {
  return await client.program.methods
    .createGroup()
    .accounts({
      admin: adminPk,
      payer: adminPk,
    })
    .instruction();
}

/**
 * @deprecated
 */
export async function getGroupForAdmin(
  client: MangoClient,
  adminPk: PublicKey,
): Promise<Group> {
  const groups = (
    await client.program.account.group.all([
      {
        memcmp: {
          bytes: adminPk.toBase58(),
          offset: 8,
        },
      },
    ])
  ).map((tuple) => Group.from(tuple.publicKey, tuple.account));
  return groups[0];
}
