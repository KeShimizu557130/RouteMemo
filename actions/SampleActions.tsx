import { createAction } from '@reduxjs/toolkit';

export const changeName = createAction<string>("CHANGE_NAME");