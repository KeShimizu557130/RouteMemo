import {Drive, DriveImpl} from './Drive';

/**
 * 運転履歴を保持するドメインクラスです
 */
export default class DriveHistory {

  private drives: Drive[];

  /**
   * コンストラクタ
   */
  constructor() {
    this.drives = this.initializeDrives();
  }

  /**
   * ログを追加します
   */
  addNewRecord = () => {
    let lastRecord: Drive;
    this.drives = this.drives
                      .map((drive, index) => {
                        if (index !== this.drives.length - 1) return drive;
                        drive.moveNextInput();
                        lastRecord = drive;
                        return lastRecord;
                      });
    if (lastRecord.isAllAreaInputed) {
      const newDrive = new DriveImpl(this.drives.length);
      newDrive.arrivalTime = (new Date()).toLocaleTimeString();
      this.drives.push(newDrive);
    }
  }

  /**
   * 地点名を追加します
   * @param newPointName 
   */
  addPointName(newPointName: string) {
    this.drives = this.drives
      .map((drive, index) => {
        if (index !== this.drives.length - 1) return drive;
        drive.pointName = newPointName;
        return drive;
      });
  }

  /**
   * 運転履歴を取得します
   */
  getDriveList() : Drive[] {
      return this.drives;
  }
  
  /**
   * initialize state value;
   */
  private initializeDrives = () => {
    return [
      new DriveImpl(0, 'スタート地点', "",""), 
      new DriveImpl(1, '村営駐車場', "",""),
      new DriveImpl(2, '休憩所', "",""),  
    ]
  }

}