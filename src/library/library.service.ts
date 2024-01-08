import { Role } from "@prisma/client";
import { db } from "../utils/db.server";
import { AlreadyRegistered, BookExists, BookNotAvailable, ForbiddenError, NotFoundError, UserHasOverdueBooks, UserNotVerified } from "../utils/errors";

export const allMembers =async () => {
  try {
    const members = db.memberProfile.findMany()
    return members
  } catch (error:any) {
    throw error
  }
}

export const newMembers =async (id:string) => {
  try {
    const existingMember = await db.memberProfile.findFirst({ where: {id}})
    if (existingMember) {
      throw new AlreadyRegistered("Member is already registered")
    }
    const member = await db.memberProfile.create({
      data: {
        memberId: id
      }
    })
    return member
  } catch (error: any) {
    throw error
  }
}

export const memberById = async (id: string) => {
  try {
    const member = await db.memberProfile.findUnique({
      where: { memberId: id },
      include: { borrowedBooks: true, OverdueBooks: true },
    });

    if (!member) {
      throw new NotFoundError("Member not found");
    }

    return member;
  } catch (error: any) {
    throw error;
  }
};

export const deleteMember =async (id:string) => {
  try {
    const member = await memberById(id)
    await db.memberProfile.delete({
      where: { memberId:id }
    })
  } catch(error:any) {
    throw error
  }
}

export const allBooks = async (role: Role, userId: string) => {
  try {
    const member = await db.memberProfile.findFirst({ where: { memberId: userId } });

    if (!member && role !== 'ADMIN' && role !== 'LIBRARIAN') {
      throw new ForbiddenError("You do not have enough permissions");
    }

    const books = await db.books.findMany();
    return books;
  } catch (error: any) {
    throw error;
  }
};


export const newBooks =async (title:string, author:string, copies:number) => {
  try {
    const existingBook = await db.books.findFirst({
      where: {
        title,
        author
      }
    })
    if (existingBook) {
      throw new BookExists()
    }
    const book = await db.books.create({
      data: {
        title,
        author,
        copies
      }
    })
    return book
  } catch (error:any) {
    throw error
  }
}

export const bookById =async (id:string, userId:string, role:Role) => {
  try {
    const member = await db.memberProfile.findFirst({ where: { memberId: userId } });

    if (!member && role !== 'ADMIN' && role !== 'LIBRARIAN') {
      throw new ForbiddenError("You do not have enough permissions");
    }
    const book = await db.books.findUnique({
      where: {id},
      include: {borrowed:true}
    })
    if (!book) {
      throw new NotFoundError("Book not found")
    }
    return book
  } catch (error:any) {
    throw error
  }
}

export const editBook =async (id:string, userId:string, role:Role, title:string, author:string, copies:number) => {
  try {
    const book = await bookById(id, userId, role)
    const editBook = await db.books.update({
      where: {id},
      data: {
        title,
        author,
        copies
      }
    })
    return editBook
  } catch(error:any) {
    throw error
  }
}

export const deleteBook =async (id:string) => {
  try {
    const book = await db.books.findUnique({ where: {id} })
    if (!book) {
      throw new NotFoundError("Book not found")
    }
    return await db.books.delete({ where: {id}})

  } catch (error:any) {
    throw error
  }
}

export const borrow = async (bookId: string, memberId: string) => {
  try {
    const existingMember = await db.memberProfile.findFirst({
      where: { memberId },
      include: { OverdueBooks: true },
    });

    if (!existingMember) {
      throw new NotFoundError("You are not a member");
    }

    const existingBook = await db.books.findUnique({
      where: { id: bookId },
    });

    if (!existingBook) {
      throw new NotFoundError("Book not found");
    }

    if (existingBook.copies < 1) {
      throw new BookNotAvailable();
    }

    if (existingMember.OverdueBooks.length > 0) {
      throw new UserHasOverdueBooks();
    }

    const now = new Date();
    const due = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const book = await db.borrowedBooks.create({
        data: {
          borrowedBy: {
            connect: { memberId: existingMember.memberId}
          },
          borrowedBook: {
            connect: { id: existingBook.id}
          },
          dueDate: due
        }
      })

    return book;
  } catch (error: any) {
    throw error;
  }
};

export const returnBook = async (bookId: string, memberId: string) => {
  try {
    const existingMember = await db.memberProfile.findFirst({
      where: { memberId },
      include: { OverdueBooks: true, borrowedBooks:true }
    });

    if (!existingMember) {
      throw new NotFoundError("You are not a member");
    }

    const borrowed = await db.borrowedBooks.findFirst({
      where: {
        booksId: bookId,
        memberId: existingMember.id,
      },
    });

    if (!borrowed) {
      throw new NotFoundError("This book was not borrowed by this member");
    }

    const updatedBook = await db.borrowedBooks.delete({
      where: { id: borrowed.id },
      include: { borrowedBy: true, borrowedBook: true },
    });      
    
    return updatedBook;
  } catch (error: any) {
    throw error;
  }
};

