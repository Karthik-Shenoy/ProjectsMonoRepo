package game

type Player struct {
	userName string
	position uint8
	isAlive  bool
}

func (player *Player) SetName(name string) {
	player.userName = name
}

func (player *Player) GetName() string {
	return player.userName
}

func (player *Player) Kill() {
	player.isAlive = false
}

func (player *Player) IsAlive() bool {
	return player.isAlive
}

func (player *Player) SetPosition(pos uint8) {
	player.position = pos
}

func NewPlayer(userName string) *Player {
	return &Player{
		userName: userName,
		isAlive:  true,
	}
}
